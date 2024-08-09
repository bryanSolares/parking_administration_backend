--postgresql
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

--mysql
DELIMITER //

CREATE FUNCTION can_create_more_schedules_in_slot(slt_id VARCHAR(255))
RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE schedules_allowed INT;
    DECLARE schedules_created INT;

    -- Obtener el límite de horarios permitidos
    SELECT limit_schedules INTO schedules_allowed
    FROM slot
    WHERE id = slt_id;

    -- Contar los horarios creados con estado 'ACTIVO'
    SELECT COUNT(*) INTO schedules_created
    FROM schedule
    WHERE slot_id = slt_id AND status = 'ACTIVO';

    -- Comparar los horarios creados con el límite permitido
    IF schedules_created < schedules_allowed THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END //

DELIMITER ;
