var botConfig = require('./../../server/bot.conf.json');


module.exports = {
    show: function(id, callback) {
        return { title: id};
    },
    list: function() {
        return {title:'Список ботов',list: botConfig};
    }
};