import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListImageRequestDto } from '@components/image/dto/request/get-list-image.request.dto';
import { GetDetailImageRequestDto } from '@components/image/dto/request/get-detail-image.request.dto';
import { ImageRepositoryInterface } from '@components/image/interface/image.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from 'src/models/image/image.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class ImageRepository
  extends BaseAbstractRepository<Image>
  implements ImageRepositoryInterface
{
  constructor(
    @InjectModel(Image.name)
    private readonly imageSchema: Model<Image>,
  ) {
    super(imageSchema);
  }

  createDocument(request: any): Image {
    const image = new this.imageSchema();

    image.itemId = new Types.ObjectId(request.itemId) || request.itemId;
    image.url = request.url;

    // implement your logic here

    return image;
  }

  updateDocument(image: Image, request: any): Image {
    image.itemId = request.itemId;
    image.url = request.url;
    // implement your logic here
    return image;
  }

  async getList(request: GetListImageRequestDto): Promise<any> {
    const { keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { code: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        ],
      };
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = { ...sortObj, code: sort };
            break;
          case 'name':
            sortObj = { ...sortObj, name: sort };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1, _id: -1 };
    }

    const data = await this.imageSchema
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.imageSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailImageRequestDto): Promise<any> {
    const { id } = request;
    const image = await this.imageSchema.findById(id).exec();
    return image;
  }
}
