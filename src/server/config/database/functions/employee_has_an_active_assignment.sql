--postgresql
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

--mysql
DELIMITER //

CREATE FUNCTION employee_has_an_active_assignment(emplo_id VARCHAR(255))
RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE hasAssignment BOOLEAN;

    SELECT EXISTS (
        SELECT 1
        FROM assignment a
        WHERE a.employee_id = emplo_id
          AND a.status in ('CREADO', 'EN_PROGRESO', 'ACTIVO')
        UNION ALL
        SELECT 1
        FROM assignment_loan al
        WHERE al.employee_id = emplo_id
          AND al.status = 'ACTIVO'
    ) INTO hasAssignment;

    RETURN hasAssignment;
END //

DELIMITER ;

