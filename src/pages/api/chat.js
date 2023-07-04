// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from  'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://chat-with-ai.xyz'); // 允许来自所有域的请求访问，可以根据需求设置为特定域名
  res.setHeader('Access-Control-Allow-Methods', 'POST'); // 允许的请求方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头

  if(req.method !== 'POST'){
    res.status(405).json({message: 'Method should be POST'});
  }else{
    try{
      const {body} = req;
      const url= 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };
    
      const response =  await axios.post(url,body, {headers: headers});
      return res.status(200).json(response.data);
    }catch(error){
      console.log(error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message, // 返回错误消息
        stack: error.stack // 返回错误堆栈信息
      });
    }
  }
  
  
}
