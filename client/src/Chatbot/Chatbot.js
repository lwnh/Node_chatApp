import Axios from 'axios';
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions'

function Chatbot() {
    const dispatch = useDispatch();

    useEffect(() => {
        eventQuery('welcomeToMyWebsite');
    }, [])

    const textQuery = async (text) => {

        // need to take care of the message I sent
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text  // same format with dialogflow response
                }
            }
        }
        dispatch(saveMessage(conversation));
        console.log('text I sent', conversation);
        
        // need to take care of the message Chatbot sent
        const textQueryVariables = {
            text    // same with text: text
        }
        try {
            //request to textQuery route
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)
            const content = response.data.fulfillmentMessages[0]
            conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation));
        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation));
        }
    }
    
    const eventQuery = async (event) => {
    
        const eventQueryVariables = {
            event   
        }
        try {
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            const content = response.data.fulfillmentMessages[0]
            let conversation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation));
        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation));
        }
    }

    const keyPressHandler = (e) => {
        if(e.key === "Enter") {
            if(!e.target.value) {
                return alert('you need to type somthing first');
            }

            // send request to textQuery route
            textQuery(e.target.value);
            e.target.value = "";
        }
    }
    return (
        <div style={{ 
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

            </div>

            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
            />
        </div>
    )
}

export default Chatbot;