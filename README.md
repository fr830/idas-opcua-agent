##IDAS OPC-UA Agent
###Description
The **IDAS OPC-UA Agent** is a component to connect in bidirectional way, the IoT Devices which implements the [OPC-UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) standard connection technology, with a NGSI Publish/Subscribe Context Broker as [Fiware Orion](http://catalogue.fiware.org/enablers/publishsubscribe-context-broker-orion-context-broker).

###How to run the IDAS OPC-UA Agent against a local simulated OPC-UA Server
###Pre-requisites
A. **Node.js** (v4.4.3 or greater) and npm correctly installed. Test your installation with ```node --version```<br/>
B. Your project structure is as follows: <br/>
```
<your_project_dir>
   |__ node-opcua (Download or clone the original NodeOPCUA SDK distribution at https://github.com/node-opcua/node-opcua )
   |__ idas-opcua-agent (your IDAS OPC-UA Agent)
```

C. You have an _unsecured_ Orion Context Broker (OCB) instance running on some host that you can reach on the network<br/>

D. Configure the IDAS OPC-UA Agent (Agent) so that it can talk to the OCB instance:<br/>
Edit the file ```config.js``` with your installation details, paying attention to the parameters below in particular.<br/>
The ```server``` port is needed for bidirectional communication (OCB->Agent)<br/>
 ```
contextBroker: {
    host: 'localhost', 
    port: 7002
},
server: {
    port: 4041
}
```
Change these important parameters that identify your ```context``` data inside the OCB</br>
 ```
 service: 'whirlpool',
 subservice: '/cassinetta',

 ```
 Change as you need the custom section for ```OPC-UA mapping```
 ```
 contexts: [
        {
           id: 'MyDevice1',
            type: 'whr-teststation',
            mappings: [
                {
                    ocb_id: 'attrib1',
                    opcua_id: 'ns=1;s=PumpSpeed'
                },
                {
                    ocb_id: 'attrib2',
                    opcua_id: 'ns=1;s=Temperature'
                }
            ]
        },
        {
            id: 'MyDevice2',
            type: 'whr-teststation',
            mappings: [
                {
                    ocb_id: 'attrib1',
                    opcua_id: 'ns=1;s=PumpSpeed2'
                },
                {
                    ocb_id: 'attrib2',
                    opcua_id: 'ns=1;s=Temperature2'
                }
            ]
        }
    ]

 ```
###Launch
1. Open a terminal session
2. ```cd to <your_project_dir>/node-opcua```
3. Launch the simulated Server: ```node bin/simple_server.js```
4. Look at the on-screen log for any problems 
5. Once the server has initialized itself, take note of the endpoint: look at **endpointUrl** log line on the screen (something like "```opc.tcp://<machine_name>:<port>```")
6. Leave the terminal session running: you can shut down the Server anytime by pressing CTRL+C
7. Open a new and separate terminal session
8. ```cd to <your_project_dir>/idas-opcua-agent```
9. Launch the Agent: ```node index.js -e "endpointUrl"``` (e.g., ```node index.js -e "opc.tcp://UbuntuDesk:26543"```
10. Look at the on-screen log for any problems, and enjoy yourself :wink:
11. The agent will terminate itself when done

###License
IDAS OPC-UA Agent software is licensed under [Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.html) (GPL) version 3.
