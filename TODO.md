TODO:

# Location

[ ] not allow update location from multiple to single or unavailable to available
[ ] improve delete slots when slot does not exists (technical debt)
[ ] can not create slot occupied

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
[X] add return error 404 if not found in finder by id
[X] fix issue with uuid in create assignment loan and create assignment
[ ] Improve save data employee in create assignment (cache data)
[ ] Cant create assignment if slot or location is inactive
[ ] After create assignment change status from slot
[ ] save employee from ws in redis
[ ] add types for employee web service data
[ ] welcome email to employee
[ ] create api_key for employee
[ ] handle error if code employee already exists
[ ] email to owner with discount note
[ ] add new method to get assignment loan

[X] finder all assignments
[X] finder employee by code
[X] assignment by id
[X] create assignment
-- [ ] email to RRHH if slot is type cost
-- [ ] welcome email to owner
-- [ ] welcome email to guest
[X] create assignment loan
-- [ ] send email to owner, guest
[X] create discount note
-- [ ] send email to owner and RRHH with discount note
[X] create de_assignment
-- [ ] real time notification
[ ] update assignment
[ ] update assignment load
[ ] delete assignment
[ ] delete assignment loan

# All application

[ ] change logger to pino
[ ] fix structure of error messages in zod middleware
[ ] uncatched error with wrong format in request
[ ] solve problem with "as" alias entities
[ ] implement handle error in hole application
[ ] fix issue with timezone in docker

# Notifications

- Create assignment
  [X] Owner
  [X] Guest if exists
- Create Assignment Guest
  [X] Owner
  [X] Guest
  [ ] Owner location
- Create discount note
  [X] RRHH
  [X] Owner
- De-Assignment
  [X] Owner
  [ ] Guest if exists
