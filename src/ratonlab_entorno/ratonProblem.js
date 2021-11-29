const Problem = require('../core/Problem');

/**
 * Simple reflex agent problem. Define a problem to be solved by a simple reflex agent 
 */
class CleanerProblem extends Problem {
    
    constructor(args) {
        super(args);
        this.env = args;
        
    }

    /**
     * Check if the given solution solves the problem. You must override.
     * The current state of the enviroment is maintained in data.world
     * @param {Object} solution 
     */
    goalTest(data) {
        let minX = min(data.world);
        if (data.interations >= this.env.maxIterations)
            return true;
        if (minX == 0) {
            return true;
        }
        return false;
    }

    /**
     * The transition model. 
     * Tells how to change the state (data) based on the given actions. You must override
     * In this case, the actions can be one the four movements or the TAKE action.
     * In this case, what changes based on the movement actions is the x or y position of the agent
     * or the current cell if the action is TAKE
     * @param {} data 
     * @param {*} action 
     * @param {*} agentID 
     */
    update(data, action, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        if (action == "UP") {
            agentState.y -= 1;
        }
        if (action == "DOWN") {
            agentState.y += 1;
        }
        if (action == "LEFT") {
            agentState.x -= 1;
        }
        if (action == "RIGHT") {
            agentState.x += 1;
        }
        if (action == "TAKE") {
            map[agentState.y][agentState.x] = 0;
        }
        if (!data.interations) {
            data.interations = 1;
        } else {
            data.interations++;
        }
    }

    /**
     * Gives the world representation for the agent at the current stage.
     * Notice that the agent don't have access to the whole labyrinth. It only "see"
     * the cell around and under it. 
     * @param {*} agentID 
     * @returns and object with the information to be sent to the agent
     */
    perceptionForAgent(data, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        let x = agentState.x;
        let y = agentState.y;
        
        let left;
        let up;
        let rigth;
        let down;
        let muro=1000000;

        
        let result = [];        

        if(typeof agentState.mapa == 'undefined'){

            /**console.log("mapa:", typeof agentState.mapa)*/
            agentState.mapa = Array.from(Array(13), ()=> new Array(13));
            
            for(var i=0;i<agentState.mapa.length ;i++){
                for(var j=0;j<agentState.mapa[i].length;j++){

                    if(i>0){
                        if(j>0){
                            if(i<=map.length  && j<=map[0].length){
                                if(map[i-1][j-1]==1){
                                    agentState.mapa[i][j]=muro;
                                }else{
                                    if(map[i-1][j-1]==-1){
                                        agentState.mapa[i][j]=-1;
                                    }else{
                                        agentState.mapa[i][j]=0;
                                    }                       
                                }        
                            }else{
                                agentState.mapa[i][j]=muro;
                            }
                        }else{
                            agentState.mapa[i][j]=muro;
                        }
                        
                    }else{
                        agentState.mapa[i][j]=muro;
                    }                
                }
            }            
        } 
        
        left = agentState.mapa[(y+1)][(x+1) - 1];  
        up = agentState.mapa[(y+1) - 1][(x+1)];  
        rigth = agentState.mapa[(y+1)][(x+1) + 1];
        down = agentState.mapa[(y+1) + 1][(x+1)];
        
        agentState.mapa[(y+1)][(x+1)]+=1; 

        //LEFT       
        if(x>0){             
            if(left<=up && left<=rigth && left<=down){
                result.push(map[y][x - 1]);
            }else{
                result.push(1);
            }                                 
        } else{
            result.push(1);
        }  
       
       
        //UP
        if(y>0){            
            if(up<=left && up<=rigth && up<=down){
                result.push(map[y - 1][x]);
            }else{
                result.push(1);
            }                                      
        }else{
            result.push(1);
        } 
              
       
        //RIGTH
        if(x < map[0].length - 1){ 
            if(rigth<=left && rigth<=up &&  rigth<=down){
                result.push(map[y][x + 1]);
            }else{
                result.push(1);
            }                                        
        }else{
            result.push(1);
        } 
       
        
        
        //DOWN        
        if(y < map.length - 1){            
            if(down<=left && down<=up && down<=rigth){
                result.push(map[y + 1][x]);
            }else{
                result.push(1);
            }                                       
        }else{
            result.push(1);
        }        
                

        result = result.map(value => value > 0 ? 1 : 0);       
        /**console.log("result = ",result[0],result[1],result[2],result[3],result[4]);*/

        //SMELL
        result.push(Math.abs(map[y][x]));
 
             
         this.motrarMapa(agentState.mapa);
        return result;
    }

    /**
     * Solve the given problem. We don't need to change in this case
     * @param {*} problem 
     * @param {*} callbacks 
     */
    /*solve(problem, callbacks) {
        this.controller.setup({ world: problem, problem: this });
        this.controller.start(callbacks);
    }*/

    motrarMapa(mapa){
        var cadenaMapa = "[\n";
        for(var i=0;i<mapa.length;i++){
            for(var j=0;j<mapa[i].length;j++){   
                if(mapa[i][j]==1000000){
                    cadenaMapa +=" "+ mapa[i][j];
                }else{
                    cadenaMapa +=" "+ mapa[i][j]+"      ";
                }         
            }
            cadenaMapa +=" \n";
        }
        cadenaMapa += "]";
        console.log(cadenaMapa);        
    }
}

module.exports = CleanerProblem;


function min(data) {
    let min = 9999999;
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        for (j = 0; j < row.length; j++) {
            if (row[j] < min) {
                min = row[j];
            }
        }
    }
    return min;
}


