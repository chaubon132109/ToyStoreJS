export interface TiktokServiceInterface {
  getShopInfomation(request: any): Promise<any>;
  getTikTokCategory(): Promise<any>;
  getWareHouseList(): Promise<any>;
  uploadImage(img_data: any, img_scene: any): Promise<any>;
  createTikTokProduct(request: any): Promise<any>;
  getTiktokOrderDetail(orderId: string): Promise<any>;
}
