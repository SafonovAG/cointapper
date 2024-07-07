const fs = require('fs');

export const Base = {
    getUsers(id) {
        const value = JSON.parse(localStorage.getItem(id))
        // if (value.energy) {
        //    value.energy = Number(value.energy);
        // }
        // if (value.dateUpdate) {
        //     value.dateUpdate = Number(value.dateUpdate);
        // }
       return value
    },
    setUsers(id, userdata) {
        // localStorage.setItem(id, JSON.stringify(userdata))
       return  fs.promises.writeFile("base.json", 'asd')
    }
}

