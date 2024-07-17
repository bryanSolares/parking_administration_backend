TODO:

# Location

[ ] not allow update location from multiple to single or unavailable to available
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

[ ] resolve hole dependency from employee web service (technical debt)
[X] fix error duplicated employee
[X] not create assignment if slot is multiple and not send schedule
[ ] validate time between 00:00 and 23:59 in schema db
[ ] add return error 404 if not found in finder by id
[X] fix issue with uuid in create assignment loan and create assignment
[ ] Improve save data employee in create assignment (cache data)
[ ] Cant create assignment if slot or location is inactive
[ ] After create assignment change status from slot
[ ] save employee from ws in redis
[ ] add type for employee web service data
[ ] welcome email to employee
[ ] create api_key for employee
[ ] handle error if code employee already exists

[X] finder all assignments
[X] finder employee by code
[X] assignment by id
[X] create assignment
-- [ ] email to RRHH if slot is type cost
-- [ ] welcome email to owner
-- [ ] welcome email to guest
[ ] create assignment loan
[ ] update assignment
[ ] update assignment load
[ ] delete assignment
[ ] delete assignment loan
[ ] create de_assignment
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
