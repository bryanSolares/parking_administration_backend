-- DELIMITER //

-- CREATE PROCEDURE get_slot_schedules_by_location(IN p_location_id VARCHAR(255))
-- BEGIN
--     SELECT
--         slt.id as slot_id,
--         lt.id as location_id,
--         count(sch.id) as current_number_of_schedules_used,
--         slt.limit_schedules
--     FROM slot as slt
--              LEFT JOIN schedule as sch on slt.id = sch.slot_id
--              INNER JOIN location as lt on slt.location_id = lt.id
--     WHERE slt.status = 'OCUPADO'
--       AND lt.id = p_location_id
--     GROUP BY slt.id;
-- END //

-- DELIMITER ;


----
CREATE PROCEDURE get_active_assignments_by_location(IN p_location_id VARCHAR(255))
BEGIN
	select
		s.id as slot_id,
		l.id as location_id,
		COUNT(a.id) current_number_of_assignments,
		s.limit_of_assignments
	from
		`assignment` a
	inner join slot s on
		a.slot_id = s.id
	inner join location l on
		s.location_id = l.id
	where
		s.status = 'OCUPADO'
		and a.status = 'ACTIVO'
		and l.id = p_location_id
	GROUP by
		a.id;
END //

DELIMITER ;
