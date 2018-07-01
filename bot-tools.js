module.exports = {
    createKeyboardButton : function(text,contact,location){
        return {
            text : text,
            request_contact : contact || false,
            request_location : location || false
        }
    },
    createReplyKeyboard : function(keyboard,resize,one_time,selective){
        return {
            keyboard : keyboard,
            resize_keyboard : resize || false,
            one_time_keyboard : one_time || false,
            selective : selective
        }
    },
    createCompleteRelpyKeyboard : function(buttonArray){
        var buttonArrayX =[];
        for(var i = 0; i < buttonArray.length; i++){
            var buttonArrayY =[];
            for(var j = 0; j < buttonArray[i].length; j++){
                buttonArrayY.push(this.createKeyboardButton(buttonArray[i][j]));
            }
            buttonArrayX.push(buttonArrayY);
        }
        return this.createReplyKeyboard(buttonArrayX);
    }

}