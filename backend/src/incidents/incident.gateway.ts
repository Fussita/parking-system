import { InjectRepository } from '@nestjs/typeorm'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Barrier } from 'src/core/entity/barrier.entity'
import { Incident, IncidentMessage } from 'src/core/entity/incident.entity'
import { User } from 'src/core/entity/user.entity'
import { VehicleEntry } from 'src/core/entity/vehicle.entity'
import { Repository } from 'typeorm'

@WebSocketGateway({ cors: true })
export class IncidentGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(Incident)
    private readonly inciRepo: Repository<Incident>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(IncidentMessage)
    private readonly msgRepo: Repository<IncidentMessage>,
  ) {}

  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket) {
    const { userId } = client.handshake.query

    if (!userId) {
      client.disconnect()
      return
    }

    const user = await this.userRepo.findOne({ where: { id: userId as string }, relations: ['incidents'], })

    if (!user) {
      client.disconnect()
      return
    }

    if (user.role === 'ADMIN') {
      const incidents = await this.inciRepo.find({ where: { status: 'OPEN' } })
      incidents.forEach((incident) => {
        client.join(`incident-${incident.id}`)
      })
    } else {
      user.incidents.forEach((incident) => {
        client.join(`incident-${incident.id}`)
      })
    }
  }

  handleDisconnect(client: Socket) {}

  async newIncident(incident: Incident) {
    const room = `incident-${incident.id}`
    this.server.to(room).emit('newIncident', { incident })
  }

  async barrierMoved(entry: Barrier) {
    this.server.emit('barriedMoved', { entry })
  }

  async newVehicleEntry(entry: any) {
    this.server.emit('vehicleEntry', { ...entry })
  }

  @SubscribeMessage('sendMessage')
  async handleMessage( client: Socket, payload: { incidentId: string, userId: string, message: string } ) {
    const incident = await this.inciRepo.findOne({ where: { id: payload.incidentId } })
    const user = await this.userRepo.findOne({ where: { id: payload.userId } })

    if (!incident || !user) return

    const msg = this.msgRepo.create({
      incident,
      sender: user,
      message: payload.message,
    })
    await this.msgRepo.save(msg)

    const room = `incident-${incident.id}`
    this.server.to(room).emit('receiveMessage', {
      user: user.name,
      message: payload.message,
      timestamp: msg.timestamp,
    })
  }
}
