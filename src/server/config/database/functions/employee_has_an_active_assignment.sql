create or replace function employee_has_an_active_assignment(emplo_id varchar)
 	returns bool
 as
 $$
 	declare hasAssignment bool;
	begin
		select count(*) > 0 into hasAssignment
			from assignment a
			where a.employee_id = emplo_id and status = 'ACTIVO';
		return hasAssignment;
	end;
 $$
 	language plpgsql;
