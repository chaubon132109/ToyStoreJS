---
to: "src/models/<%= h.fileName(name) %>/<%= h.schemaFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('Schema') %>
---
<%
 SchemaName = h.SchemaName(name);
 TableName = h.TableName(name);
 schemaModelName = h.schemaModelName(SchemaName);
%>
import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `<%= TableName %>`,
  collation: DEFAULT_COLLATION,
})
export class <%= SchemaName %> extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: number;

  @Prop({
    type: String,
    required: false,
  })
  code: string;

  @Prop({
    type: String,
    required: false,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  nameEn: string;

 @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  status: number;

  @Prop({
    type: String,
    required: false,
  })
  description: string;
}
export const <%= SchemaName %>Schema = SchemaFactory.createForClass(<%= SchemaName %>);
