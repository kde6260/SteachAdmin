
/* 쿼리빌더 사용 */
const Teacher = require('../models').Teacher;
const Assignment = require('../models').Assignment;
const Apply = require('../models').Apply;
const Student = require('../models').Student;


// class TeacherService {
//     static getJoinedTeachers(){
//         Teacher.query()
//         Teacher.findAll({
//             attributes: ['id', 
//                         'employed', 
//                         'address1', 
//                         'age', 
//                         'name', 
//                         'gender', 
//                         'university', 
//                         'grade'
//             ],
//             where: {
//                 join_status: 1
//             },
//             order: [
//                 ['id', 'desc']
//             ]
//         })
//         .then(teachers => {
            
//         })
//     }
// }


// // // /* 가입된 선생님 목록 조회 */
// Teacher.getJoinedTeachers = function(){
//     return new Promise(function(resolve, reject){
//         async.waterfall([
//             function(callback){
//                 pool.getConnection(function(err, connection){
//                     if(err) callback(err);
//                     else callback(null, connection);
//                 });
//             },
//             function(connection, callback){
//                 connection.query(`select id as t_id , employed, address1, age, name, gender, university, grade, 
//                 (select sum(fee) from expectation, assignment where expectation.id = assignment.expectation_id and assignment.teacher_id = t_id) as profit, 
//                 univ_status, account_number from teacher where join_status = 1 order by id desc`, function(err, teachers){
//                     if(err) callback(err);
//                     else callback(null, teachers, connection);
//                 });
//             },
//             function(teachers, connection, callback){
//                 async.each(teachers, function(element, done){
//                     connection.query(`select pay_day, subject, name from expectation as e, assignment as a, student as s 
//                     where e.id = a.expectation_id and a.student_id = s.id and a.teacher_id = ? and a.status = 5`, element.t_id, function(err, result){
//                         if(err) done(err);
//                         else {
//                             element.payday = result;
//                             done();
//                         }
//                     });
//                 }, function(err){
//                     if(err) callback(err);
//                     else callback(null, teachers, connection);
//                 });
//             }
//         ], 
//         function(err, teachers, connection){
//             if(connection)connection.release();
//             if(err) reject(err);
//             else resolve(teachers);
//         });
//     });
// }





module.exports = TeacherService;