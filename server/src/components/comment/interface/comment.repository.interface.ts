import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListCommentRequestDto } from '../dto/request/get-list-comment.request.dto';
import { GetDetailCommentRequestDto } from '../dto/request/get-detail-comment.request.dto';
import { Comment } from 'src/models/comment/comment.schema';
import { GetListCommentByItemRequestDto } from '../dto/request/get-comment-by-item-id.dto';

export interface CommentRepositoryInterface
  extends BaseInterfaceRepository<Comment> {
  createDocument(request: any): Comment;
  updateDocument(comment: Comment, request: any): Comment;
  getList(request: GetListCommentRequestDto): Promise<any>;
  getDetail(request: GetDetailCommentRequestDto): Promise<any>;
  getListCommentByItemId(request: GetListCommentByItemRequestDto): Promise<any>;
}
