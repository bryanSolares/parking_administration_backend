TODO:

# Location

[ ] not allow update location from multiple to single
[ ] improve delete slots when slot does not exists (technical debt)

[X] create location
[X] create slots
[X] update location
[X] update slots
[X] delete location
[X] delete slots
[X] location by id
[X] finder all locations with page and limit

# Assignment

[X] fix error duplicated employee
[X] not create assignment if slot is multiple and not send schedule
[ ] welcome email to employee
[ ] create api_key for employee
[ ] validate time between 00:00 and 23:59 in schema db
[ ] add return error 404 if not found in finder by id
[X] fix issue with uuid in create assignment loan and create assignment
[ ] Improve save data employee in create assignment (cache data)
[ ] Cant create assignment if slot or location is inactive

[ ] create assignment
[ ] create assignment loan
[ ] update assignment
[ ] update assignment load
[ ] delete assignment
[ ] delete assignment loan
[ ] create unassignment
[ ] create discount note

# All application

[ ] change logger to pino
[ ] fix structure of error messages in zod middleware
[ ] uncatched error with wrong formar in request

# Sequelize relations

OneToOne (foreing key defined in target model)
OneToMany (foreing key defined in target model)

A (source) - B (target)

A.hasOne(B) | A.hasMany(B) -> Foreing key in B = a_id
B.belongTo(A) -> Foreing key in B = a_id
