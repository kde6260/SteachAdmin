const pool = require('../utils/mysql').getPool();

class Student{}

Student.getConn = function(){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else resolve(connection); //에러 없으면 커낵션 객체 resolve(다음 then으로 넘어감)
        });
    });
};

Student.getAll = function(){
    return new Promise(function(resolve, reject){
        Student.getConn()
        .then(function(connection){ //TODO : 수강료, 이 달 수강료...
            return new Promise(function(resolve, reject){
                let query = `select * from 
                            (select e.id as e_id , e.assign_status, e.subject, s.school_name, s.grade, concat(s.address1,' ',s.address2) as address, s.name as s_name, s.mother_phone, s.father_phone, e.class_form, e.fee, e.deposit_day, e.called_consultant, e.visited_consultant, e.calling_day, e.visiting_day, e.first_date
                            from student s, expectation e 
                            where s.id = e.student_id order by s.id desc) as STU 
                            left outer join
				            (select t.name as t_name, a.expectation_id as e_id from assignment a, teacher t where a.teacher_id = t.id) as TEA
				            on STU.e_id = TEA.e_id order by STU.e_id desc`;
                connection.query(query, function(err, result){
                    connection.release();
                    if(err) reject(err);
                    else resolve(result);
                });
            });
        }).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
};


Student.registerStudent = function(student, student_log, expectation){
    return new Promise(function(resolve, reject){
        Student.getConn()
        .then(function(connection){
            return new Promise(function(resolve, reject){
                connection.beginTransaction(function(err){
                    if(err) {
                        console.log(err);
                        connection.release();
                        reject([err]);
                    }
                    else resolve(connection); //에러 없으면 커낵션 객체 resolve(다음 then으로 넘어감)
                });
            });
        }).then(function(connection){
            return new Promise(function(resolve, reject){
                connection.query('insert into student set ?', student, function(err, result){
                    if(err) reject([err, connection]);
                    else resolve([connection, result.insertId]);
                });
            });
        }).then(function([connection, id]){
            return new Promise(function(resolve, reject){
                student_log.student_id = id;
                connection.query('insert into student_log set ? ', student_log, function(err){
                    if(err) reject([err, connection]);
                    else resolve([connection, id]);
                });
            });
        }).then(function([connection, id]){
            return new Promise(function(resolve, reject){
                expectation.student_id = id;
                connection.query('insert into expectation set ? ', expectation, function(err){
                    if(err) reject([err, connection]);
                    else  {
                        connection.commit(function(err){
                            if(err){
                                connection.rollback(function(){
                                    connection.release();
                                });
                            }
                            else {
                                connection.release();
                                resolve();
                            }
                        });
                    }
                });
            });
        })
        .then(function(){ resolve(); })
        .catch(function([err,connection]){
            if(connection){
                connection.rollback(function(){
                    connection.release();
                    reject(err);
                });
            }
            else reject(err);
        });
    });
};


module.exports = Student;