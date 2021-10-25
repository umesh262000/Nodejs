const dbConnection = require("../models");
const draftOrder=dbConnection.DraftOrders;
const CONFIG = require('../config/config_' + [process.env.NODE_ENV || 'local'] + '.json');
const accessToken=CONFIG.access_token;
const Shopify = require('shopify-api-node');
const asyncWait = require("async");
const draftOrders = require("../models/draft-orders");
const { default: ShopifyApi, DataType, } = require('@shopify/shopify-api');

  exports.draftOrder=(req,res)=>{
    const data=req.body;
    const dataObj={};
    dataObj.request=JSON.stringify(data)
    dbConnection.DraftOrders.create(dataObj).then(Res=>{
    })
    const draftOrder={};
    const draftOrdersData={}
    const line_items=[];
    asyncWait.forEachSeries(data.items,  function (item,callback) {
    const dataObj={};
    dataObj.quantity=item.quantity;
    dataObj.variant_id=item.variant_id;
    dataObj.product_id=item.product_id;
    line_items.push(dataObj)
    callback();
    })
    draftOrder.line_items=line_items;
    draftOrdersData.draft_order=draftOrder;
    
    // console.log(JSON.stringify(draftOrdersData));
    const client = new ShopifyApi.Clients.Rest("securecod4.myshopify.com", accessToken);
    const body=draftOrdersData;
     client.post({
        path: 'draft_orders',
        data: body,
        type: DataType.JSON,
      }).then(res=>{
        console.log(res);
          const  draftObj={};
          draftObj.create_response=JSON.stringify(res)
          dbConnection.DraftOrders.create(draftObj).then(createRes=>{

        }).catch(function(err){
            console.log(err);
        })
      });
  }
 exports.orderUpdate=(req,res)=>{
    const data=req.body;     
    const draftOrder={};
    asyncWait.forEachSeries(data.items,  function (item,callback) {
        const dataObj={};
        console.log(item);
        dataObj.note=data.note;
        dataObj.id=item.variant_id;
          draftOrder.draft_order=dataObj;  
          console.log(draftOrder);
          callback()
    })
    const client = new ShopifyApi.Clients.Rest("securecod4.myshopify.com", accessToken);
    const body=draftOrder;
     client.put({
        path: 'draft_orders',
        data: body,
        type: DataType.JSON,
      }).then(updateRes=>{
        console.log(updateRes);
      }).catch(function (error) {
        console.log(error);
      })
  }
  
exports.orderDelete=(req,res)=>{
  const {id}=req.query;
  const client = new ShopifyApi.Clients.Rest("securecod4.myshopify.com", accessToken);
 client.delete({
   path:'draft_orders/'+id
 })
}

  
