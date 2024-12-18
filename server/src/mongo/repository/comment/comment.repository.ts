import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListCommentRequestDto } from '@components/comment/dto/request/get-list-comment.request.dto';
import { GetDetailCommentRequestDto } from '@components/comment/dto/request/get-detail-comment.request.dto';
import { CommentRepositoryInterface } from '@components/comment/interface/comment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/models/comment/comment.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';
import { GetListCommentByItemRequestDto } from '@components/comment/dto/request/get-comment-by-item-id.dto';

@Injectable()
export class CommentRepository
  extends BaseAbstractRepository<Comment>
  implements CommentRepositoryInterface
{
  constructor(
    @InjectModel(Comment.name)
    private readonly commentSchema: Model<Comment>,
  ) {
    super(commentSchema);
  }

  createDocument(request: any): Comment {
    const comment = new this.commentSchema();

    if (request?.id) comment.id = request.id;

    comment.userId = new Types.ObjectId(request.userId);
    comment.itemId = new Types.ObjectId(request.itemId);
    comment.content = request.content;

    // implement your logic here

    return comment;
  }

  updateDocument(comment: Comment, request: any): Comment {
    comment.userId = new Types.ObjectId(request.userId);
    comment.itemId = new Types.ObjectId(request.itemId);
    comment.content = request.content;
    // implement your logic here
    return comment;
  }

  async getList(request: GetListCommentRequestDto): Promise<any> {
    const { keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { content: { $regex: `.*${keyword}.*`, $options: 'i' } },
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
          case 'userId':
            filterObj = {
              ...filterObj,
              userId: new Types.ObjectId(item.text),
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

    const data = await this.commentSchema
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
          },
        },
        {
          $unwind: '$item',
        },
      ])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.commentSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailCommentRequestDto): Promise<any> {
    const { id } = request;
    const comment = await this.commentSchema.findById(id).exec();
    return comment;
  }

  async getListCommentByItemId(
    request: GetListCommentByItemRequestDto,
  ): Promise<any> {
    const { itemId, skip, take } = request;

    const comment = await this.commentSchema
      .aggregate([
        {
          $match: {
            itemId: new Types.ObjectId(itemId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: take,
        },
      ])
      .exec();

    const count = await this.commentSchema
      .aggregate([])
      .match({ itemId: new Types.ObjectId(itemId) })
      .count('count')
      .exec();

    return { comment, count };
  }
}
