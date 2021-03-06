import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

import AppError from '@shared/errors/AppError';

import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment>{
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentsInSameDate = await appointmentRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentsInSameDate) {
      throw new AppError("This appointment is aready booked");
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
