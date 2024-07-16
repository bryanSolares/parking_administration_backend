
create or replace function employee_has_an_active_assignment(emplo_id varchar)
 	returns bool
 as
 $$
 	declare hasAssignment bool;
	begin

        select EXISTS (select 1
                       from assignment a
                       where a.employee_id = emplo_id
                         and a.status = 'ACTIVO'
                       union all
                       select 1
                       from assignment_loan al
                       where al.employee_id = emplo_id
                         and al.status = 'ACTIVO')
        INTO hasAssignment;

    return hasAssignment;

	end;
 $$
 	language plpgsql;

