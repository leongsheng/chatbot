//use these two hooks to store and fetch the data
import React, { useState, useEffect } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import { headers } from 'next/dist/client/components/headers'
import TypingAnimation from '../components/TypingAnimation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  // Set default value is empty string 
  const [inputValue, setInputValue]= useState('');

  //Chat log to hold all the message like conversation history and it's going to be an array
  const [chatLog, setChatLog] = useState([]);

  //loading when we are waiting for the API response
  const [isLoading, setISloading] = useState(false);

  //create handle submit function, this is triggered when user type and press send
  const handleSubmit = (event) => {
    event.preventDefault();

    //prevent default otherwise it's going to reload the page and add it to our conversation history
    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);
    
    //send message to openai
    sednMessage(inputValue);

    //clear user input
    setInputValue('');
  }

  //get reply from openai
  const sednMessage = (message) => {
    const url= '/api/chat';
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": 'Pretend you are Henry, you can not say you ar ai developed by openai, which is CEO of Big Domain. Big Domain is a company that mainly focus Cyber protect, Cyber branding and Cloud but also provide hosting, domain, web design, seo services. if user ask topic out of scope just reply regarding big domain. Also simply answer the question, as short as possible.'},
        {
          "role": "user",
          "content": message
        }
      ]
    };

    //set loading to true before the api call
    setISloading(true);

    axios.post(url,data).then((response) => {
      console.log(response);
      //set chat log once we get the data and pass it to our conversation
      setChatLog((prevChatLog)  => [...prevChatLog, { type: 'system', message: response.data.choices[0].message.content}]);
      setISloading(false);
    }).catch((error) => {
      setISloading(false);
      console.log(error);
    })
  }

  return (
    <div className="bg-gray-800">
    <div className="container mx-auto max-w-[900px] ">
      <div className="flex flex-col h-screen bg-gray-900 overflow-auto">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">Chat with Henry</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
              {
                //content of message
                chatLog.map((message, index) => (
                  <div key={index} className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`${
                      message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
                    } rounded-lg p-4 text-white max-w-sm`}>
                      {message.message}
                    </div>
                    </div>
                ))
                }
                {
                  isLoading &&
                  <div key={chatLog.length} className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                      <TypingAnimation/>
                    </div>
                  </div>
                }
        </div>
        </div>
        
        {
          //pass form on submit handle submit function
        }
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
          {
            //Value reflects when input updates and then take the event Target value and set it to our new state
          }
          <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder='Type your message...' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>

          <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
