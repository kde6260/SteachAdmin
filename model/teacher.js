const pool = require('../utils/mysql').getPool();
const async = require('async');

class Teacher{}
Teacher.getWaitingTeachers = function(){
    return new Promise(function(resolve, reject){
        async.waterfall([
            function(callback){
                pool.getConnection(function(err, connection){
                    if(err) callback(err);
                    else callback(null, connection);
                });
            },
            function(connection, callback){
                connection.query(`select id, employed, address1, age, name, gender, university, grade, univ_status 
                                  from teacher where join_status = 0 order by id`, 
                    function(err, teachers){
                        if(err) callback(err);
                        else callback(null, [teachers, connection]);
                    });
            } 
        ], function(err, [teachers, connection]){
            console.log('teachers : ', teachers);
                connection.release();
                if(err) reject(err);
                else resolve(teachers);
        });
    });
};

/* 가입된 선생님 목록 조회 */
Teacher.getJoinedTeachers = function(){
    return new Promise(function(resolve, reject){
        async.waterfall([
            function(callback){
                pool.getConnection(function(err, connection){
                    if(err) callback(err);
                    else callback(null, connection);
                });
            },/* TODO: 수강료 지급일? */
            function(connection, callback){
                connection.query(`select id as t_id , employed, address1, age, name, gender, university, grade, 
                (select sum(fee) from expectation where id = t_id), 
                univ_status, account_number from teacher where join_status = 1 order by id desc`, function(err, teachers){
                    if(err) callback(err);
                    else callback(null, [teachers, connection]);
                });
            }
        ], 
        function(err, [teachers, connection]){
            connection.release();
            if(err) reject(err);
            else resolve(teachers);
        });
    });
}


/* 회원가입 요청한 선생님 가입 승인/거절 */
Teacher.givePermission = function(teacher_id, is_permitted){
    return new Promise(function(resolve, reject){
        if(is_permitted){
            async.waterfall([
                function(callback){
                    pool.getConnection(function(err, connection){
                        if(err) callback(err);
                        else callback(null, connection);
                    });
                },
                function(connection, callback){
                    connection.query('update teacher set join_status = 1 where id = ?', teacher_id, function(err, result){
                        if(err) callback(err);
                        else callback(null, connection);
                    });
                }
            ], function(err, connection){
                connection.release();
                if(err) reject(err);
                else resolve(true);
            });
        }
        else resolve(false);
    });
};

Teacher.selectPhone = function(teacher_id){
    return new Promise(function(resolve, reject){
        async.waterfall([
            function(callback){
                pool.getConnection(function(err, connection){
                    if(err) callback(err);
                    else callback(null, connection);
                });
            },
            function(connection, callback){
                connection.query('select phone, fcm_token from teacher where id = ?', teacher_id, function(err, result){
                    if(err) callback(err);
                    else callback(null, [result, connection]);
                });
            }
        ], function(err, [result, connection]){
            connection.release();
            if(err) reject(err);
            else resolve(result);
        }); 
    });
};

module.exports = Teacher;