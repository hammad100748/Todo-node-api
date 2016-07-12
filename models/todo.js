/**
 * Created by user on 7/12/2016.
 */
module.exports=function (sequelize,DataTypes) {
    return sequelize.define('todo',{
        description:{
            type: DataTypes.STRING,
            allowNull:false,    // Cant be left Null its not optional have to fill
            validate:{
                notEmpty:true,   // Empty string not allowed
                len:[1,250]     // characters from 1 to 250
            }
        },
        completed:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false  // Default value if in case not assigned
        }
    });
};