---
to: "src/components/<%= h.fileName(name) %>/interface/<%= h.serviceInterfaceFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('ServiceInterface') %>
---
<%
  ServiceNameInterface = h.ServiceNameInterface(name);
  
  GetListDtoName = h.GetListDtoName(name);
  GetDetailDtoName = h.GetDetailDtoName(name);
  CreateDtoName = h.CreateDtoName(name);
  UpdateDtoName = h.UpdateDtoName(name);
  DeleteDtoName = h.DeleteDtoName(name);

  getListDtoFileName = h.getListDtoFileName(name);
  getDetailDtoFileName = h.getDetailDtoFileName(name);
  createDtoFileName = h.createDtoFileName(name);
  updateDtoFileName = h.updateDtoFileName(name);
  deleteDtoFileName = h.deleteDtoFileName(name);
%>
import { <%= GetListDtoName %> } from '../dto/request/<%= getListDtoFileName %>';
import { <%= GetDetailDtoName %> } from '../dto/request/<%= getDetailDtoFileName %>';
import { <%= CreateDtoName %> } from '../dto/request/<%= createDtoFileName %>';
import { <%= UpdateDtoName %> } from '../dto/request/<%= updateDtoFileName %>';
import { <%= DeleteDtoName %> } from '../dto/request/<%= deleteDtoFileName %>';

export interface <%= ServiceNameInterface %> {
  getList(request: <%= GetListDtoName %>): Promise<any>;
  getDetail(request: <%= GetDetailDtoName %>): Promise<any>;
  create(request: <%= CreateDtoName %>): Promise<any>;
  update(request: <%= UpdateDtoName %>): Promise<any>;
  delete(request: <%= DeleteDtoName %>): Promise<any>;
}
