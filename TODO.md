TODO:

# Location

[ ] validate uuid valid for slots, uuid should exists othwerwise return 404
[ ] not allow update location from multiple to single
[ ] create CRUD to maintain schedules

# Assignment

[X] fix error duplicated employee
[ ] not create assignment if slot is multiple and not send schedule
[ ] validate time between 00:00 and 23:59 in schema db
[ ] add return error 404 if not found in finder by id
[ ] fix issue with uuid in create assignment loan and create assignment

# All application

[ ] change logger to pino
[ ] fix structure of error messages in zod middleware

# Sequelize relations

OneToOne (foreing key defined in target model)
OneToMany (foreing key defined in target model)

A (source) - B (target)

A.hasOne(B) | A.hasMany(B) -> Foreing key in B = a_id
B.belongTo(A) -> Foreing key in B = a_id
