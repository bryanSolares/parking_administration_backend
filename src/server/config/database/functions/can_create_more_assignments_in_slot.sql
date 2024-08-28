--mysql
DELIMITER //

CREATE FUNCTION can_create_more_assignments_in_slot(slt_id VARCHAR(255))
RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE assignments_allowed INT;
    DECLARE assignments_created INT;

    -- Obtener el límite de horarios permitidos
    SELECT limit_of_assignments INTO assignments_allowed
    FROM slot
    WHERE id = slt_id;

    -- Contar los horarios creados con estado 'ACTIVO'
    SELECT COUNT(*) INTO assignments_created
    FROM `assignment` a
    WHERE slot_id = slt_id AND status not in ('BAJA_AUTOMATICA', 'BAJA_MANUAL', 'CANCELADO');

    -- Comparar los horarios creados con el límite permitido
    IF assignments_created < assignments_allowed THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END //

DELIMITER ;
