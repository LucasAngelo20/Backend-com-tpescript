import { Router } from "express";
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";

import AppointmentsRepository from "@modules/appointments/repositories/AppointmentsRepository";
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

import ensureAunthenticated from "../../../../../shared/infra/http/middlewares/ensureAunthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAunthenticated);

appointmentsRouter.get("/", async (request, response) => {
  console.log(request.user)

  const appointmentRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post("/", async (request, response) => {
 
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
