import fs from 'node:fs';
import { NotificationMailRepository } from '@src/contexts/assignment/core/repositories/notification-mail-repository';
import { Mailer } from '@src/server/config/mail/nodemailer';

export class NodemailerNotificationRepository implements NotificationMailRepository {
  private _transporter: Mailer;

  constructor() {
    this._transporter = new Mailer();
  }

  async assignmentNotification(
    employee: { name: string; email: string; token: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startTime: string; endTime: string } | null
  ): Promise<void> {
    const message = `
    <h1>Assignment Notification</h1>
    <h2>Bienvenido estimad(@): ${employee.name}!</h2>

    <p>El equipo de Asignación de Parqueos te informa que se le ha asignado  un nuevo parqueo disponible. El número de parqueo es ${location.slotNumber} y su ubicación es ${location.address}, puede llegar cualquier duda adicional a soporte@parqueos.com.</p>
    ${schedule ? `<p>Puede disponer de esta asignación a partir de las ${schedule.startTime} hasta ${schedule.endTime}.</p>` : ``}
    <p>Tu token de acceso es: ${employee.token}</p>
    <p>Puedes consultar tu asignación aquí: <a href="https://parqueos.com.gt">https://parqueos.com.gt</a></p>
    `;

    await this._transporter.sendNotification(employee.email, '', 'Parking Assignment', message);
  }

  async assignmentGuestNotification(
    owner: { name: string; email: string },
    guest: { name: string; email: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startDate: string; endDate: string }
  ): Promise<void> {
    const message = `
    <h1>Temporary parking assignment Notification</h1>
    <h2>Bienvenido estimad(@): ${guest.name}!</h2>

    <p>Te informamos que ${owner.name} ha solicitado una asignación temporal de parqueo para tí.</p>
    <p>Puede disponer de esta asignación a partir de ${schedule.startDate} hasta ${schedule.endDate}.</p>
    <p>El número de parqueo es ${location.slotNumber} y su ubicación es ${location.address}, puede llegar cualquier duda adicional a soporte@parqueos.com.</p>
    `;

    await this._transporter.sendNotification(guest.email, owner.email, 'Assignment Guest', message);
  }

  async discountNoteNotification(owner: { name: string; email: string }, rrhh: { name: string; email: string }): Promise<void> {
    const message = `
    <h1>Discount note Notification</h1>
    <h2>Estimad(@): ${owner.name}</h2>
    <p>El parqueo asignado para tí tiene la característica de ser de tipo Cobro, por favor hacer llegar la nota de aceptación de descuento adjunto al equipo de recursos humanos.</p>
    <p>Puede hacerla llegar firmada de aceptación a la siguiente dirección: ${rrhh.email}</p>
    `;

    let attachment;
    try {
      attachment = fs.createReadStream(__dirname + '/../../../../assets/discount-note.pdf');
    } catch (error) {
      console.log(error);
    }

    await this._transporter.sendNotification(owner.email, rrhh.email, 'Discount Note', message, [
      {
        filename: 'discount-note.pdf',
        content: attachment ?? ''
      }
    ]);
  }

  async deAssignmentOwnerNotification(owner: { name: string; email: string }): Promise<void> {
    const message = `
    <h1>De-Assignment Notification</h1>
    <h2>Estimad(@): ${owner.name}!</h2>

    <p>Le informamos que su asignación ubicada en: "<>" y con número: <> ha sido desactivada, por lo cuál ya no podrá disponer de esta ubicación.</p>
    <p>Si esto ha sido un error, le suplicamos que pueda comunicase al +(502) xxxx-xxxx o al correo.</p>
    `;

    await this._transporter.sendNotification(owner.email, '', 'Parking De-Assignment Owner', message);
  }

  async deAssignmentGuestNotification(guest: { name: string; email: string }): Promise<void> {
    const message = `
    <h1>De-Assignment Notification</h1>
    <h2>Estimad(@): ${guest.name}!</h2>

    <p>Le informamos que su asignación ubicada en: "<>" y con número: <> ha sido desactivada, por lo cuál ya no podrá disponer de esta ubicación.</p>
    <p>Si esto ha sido un error, le suplicamos que pueda comunicase al +(502) xxxx-xxxx o al correo.</p>
    `;

    await this._transporter.sendNotification(guest.email, '', 'Parking De-Assignment Guest', message);
  }
}
