import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async create(email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({ email, password: hashed })
    return this.userRepository.save(user)
  }

  async updateRefreshToken(id: number, token: string | null): Promise<void> {
    await this.userRepository.update(id, { refreshToken: token })
  }
}