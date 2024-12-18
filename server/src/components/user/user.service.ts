import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';
import { ResponseBuilder } from '@utils/response-builder';

import { UserServiceInterface } from './interface/user.service.interface';
import { UserRepositoryInterface } from './interface/user.repository.interface';

import { GetListUserRequestDto } from './dto/request/get-list-user.request.dto';
import { GetDetailUserRequestDto } from './dto/request/get-detail-user.request.dto';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { DeleteUserRequestDto } from './dto/request/delete-user.request.dto';

import { GetListUserResponseDto } from './dto/response/get-list-user.response.dto';
import { GetDetailUserResponseDto } from './dto/response/get-detail-user.response.dto';

import { PagingResponse } from '@utils/paging.response';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Types } from 'mongoose';

@Injectable()
export class UserService implements UserServiceInterface {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}
  getUserByUsername(username: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async create(request: CreateUserRequestDto): Promise<any> {
    const userDocument = this.userRepository.createEntity(request);

    const user = await this.userRepository.create(userDocument);

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListUserRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.userRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListUserResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getDetail(request: GetDetailUserRequestDto): Promise<any> {
    const user = await this.userRepository.getDetail(request);
    // implement logic here
    if (isEmpty(user)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const response = plainToInstance(GetDetailUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateUserRequestDto): Promise<any> {
    const { id } = request;
    const user = await this.userRepository.findOneById(id);

    if (isEmpty(user)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newUser = this.userRepository.updateDocument(user, request);

    const userUpdate = await this.userRepository.findByIdAndUpdate(id, newUser);

    // implement logic here
    return new ResponseBuilder(userUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteUserRequestDto): Promise<any> {
    const { id } = request;
    const user = await this.userRepository.findOneById(id);

    if (isEmpty(user)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.userRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async checkLogin(username: string, password: string): Promise<any> {
    const user = await this.userRepository
      .findOne({ username })
      .select('+password')
      .exec();
    const result = await this.userRepository.checkLogin(user, password);
    return {
      result: result,
      user: user,
    };
  }
  async getUserDetail(request: any) {
    const { userId } = request;
    console.log('🚀 ~ UserService ~ getUserDetail ~ userId:', userId);
    const result = await this.userRepository.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'shippingAddresses', // Tên collection của ShippingAddress
          localField: '_id', // Khóa liên kết ở User
          foreignField: 'userId', // Khóa liên kết ở ShippingAddress
          as: 'shippingAddresses', // Tên trường chứa kết quả lookup
        },
      },
    ]);
    return result[0];
  }
}
