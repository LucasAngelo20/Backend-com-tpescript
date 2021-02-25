import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: Request): Promise<Appointment >{
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentsInSameDate = await appointmentRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentsInSameDate) {
      throw Error("This appointment is aready booked");
    }

    const appointment = appointmentRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
