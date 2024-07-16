create or replace function can_create_more_schedules_in_slot(slt_id varchar)
	returns bool
as
$$
	declare schedules_allowed int;
	declare schedules_created int;
	begin
		select limit_schedules into schedules_allowed from slot where id = slt_id;
		select count(*) into schedules_created from schedule where slot_id = slt_id and status = 'ACTIVO';

		if (schedules_created < schedules_allowed) then
			return true;
		end if;

		return false;
	end;
$$
 language plpgsql;
