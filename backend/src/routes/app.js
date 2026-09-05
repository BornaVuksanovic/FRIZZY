import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../index.js";



export const registerHairdresser = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber, role} = req.body;

        if( !username || !password || !firstName || !lastName || !phoneNumber){
            return res.status(400).json({ message: "All fields are required"});
        }

        if (password.length < 6){
            return res.status(400).json({ message: "Password less than 6 characters"});
        }

        if( username.length < 3){
            return res.status(400).json({ message: "Username should be at least 3 characters long" });
        }

        const isUsernameTaken = await prisma.user.findUnique({
            where: { username: username }
        });

        if ( isUsernameTaken ){
            return res.status(400).json({ message: "Username is already taken"});
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await prisma.user.create({data: { username, password: hashedPassword, firstName, lastName, phoneNumber, role}});

        
        res.status(201).json({
            message: "Hairdresser successfully created",
            user,
        
        })

    } catch (error) {
        console.log("Greska pri kreitanju frizera u bazi", error);   
        res.status(400).json({
            message: "Hairdresser creation failed",
            error: error.message
        })
    }
}

export const createService = async (req,res) => {
    try {
        const {name, price, duration} = req.body;

        if (!name || !price || !duration ) {
            return res.status(400).json({ message: "Missing required fields: name, price, or duration" });
        }

        if (price < 0){
            return res.status(400).json({ message: "Price can't be negative number"});
        }

        if (duration <= 9){
            return res.status(400).json({ message: "Duration must me at least 10 minutes"});
        }
    
        const service = await prisma.service.create({data: { name, price, duration}});

        
        res.status(201).json({
            message: "Service successfully created",
            service
        })

    } catch (error) {
        console.log("Error service creation", error);   
        res.status(500).json({
            message: "Service creation failed",
            error: error.message
        })
    }
}

export const createAppointment = async (req,res) => {
    try {
        const {startDate, clientId, hairdresserId, serviceId} = req.body;

        if (!startDate || !clientId || !hairdresserId || !serviceId ) {
            return res.status(400).json({ message: "Missing required fields: name, price, or duration" });
        }

        const appointment = await prisma.appointment.create({data: {startDate, clientId, hairdresserId, serviceId}});

        res.status(201).json({
            message: "Appointment successfully creted",
            appointment
        })

    } catch (error) {
        console.log("Error appointment creation", error);   
        res.status(400).json({
            message: "Appointment creation failed",
            error: error.message
        })    
    }
}

export const getHairdresserAppointments = async (req, res) => {
    try {
        const { hairdresserId, date, type} = req.query; // type: today,upcoming, past

        if (!hairdresserId) {
            return res.status(400).json({ message: "Missing hairdresser ID" });
        }

        let dateFilter = {};
        const now = new Date();

        if (type === 'today') {
            const start = new Date(date); start.setHours(0,0,0,0);
            const end = new Date(date); end.setHours(23,59,59,999);
            dateFilter = { gte: start, lte: end };
        } else if (type === 'upcoming') {
            dateFilter = { gt: now };
        } else if (type === 'past') {
            dateFilter = { lt: now };
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                hairdresserId: parseInt(hairdresserId),
                startDate: dateFilter
            },
            select: {
                id: true,
                startDate:true,
                service:{
                    select: { duration: true, name: true, price: true}
                },
                client: {
                    select: { firstName: true, lastName: true, phoneNumber: true}
                }
            },
            orderBy: { startDate: type === 'past' ? 'desc' : 'asc' }
        });

        res.status(200).json({
            message: "Hairdressers appointments",
            appointments
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Faild to get hairdressers appointments",
            error: error.message
        })
    }
}

export const getAppointments = async (req, res) => {
    try {
        const { type } = req.query; //  'today', 'upcoming' or 'past'
        let dateFilter = {};
        const now = new Date();

        if (type === 'today') {
            const start = new Date(); start.setHours(0,0,0,0);
            const end = new Date(); end.setHours(23,59,59,999);
            dateFilter = { gte: start, lte: end };
        } else if (type === 'upcoming') {
            dateFilter = { gt: now };
        } else if (type === 'past') {
            dateFilter = { lt: now };
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                startDate: dateFilter
            },
            include: { service: true, client: true, hairdresser: true},
            orderBy: { startDate: type === 'past' ? 'desc' : 'asc' }
        });

        res.status(200).json({
            message: "Appointments",
            appointments
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Faild to get appointments",
            error: error.message
        })  
    }
    
};

export const getClientAppointments = async (req, res) => {
    try {
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                clientId: parseInt(clientId),
            },
            select: {
                id: true,
                startDate:true,
                service: true,
                hairdresser: true
            }
        });
        res.status(200).json({
            message: "Client appointments",
            appointments
        })
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        res.status(500).json({
            message: "Faild to get client appointments",
            error: error.message
        })
    }
}

export const getHairdressers = async (req,res) => {
    try {  
        const hairdressers = await prisma.user.findMany({
            where: {
                role: "HAIRDRESSER"
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });

        res.status(200).json({
            message: "List of hairdressers",
            hairdressers
        })

    } catch (error) {
        res.status(400).json({
            message: "Faild to fetch hairdressers",
            error: error.message
        })
    }
}

export const getServices = async (req,res) => {
    try {  
        const services = await prisma.service.findMany();

        res.status(200).json({
            message: "List of services",
            services
        })

    } catch (error) {
        res.status(400).json({
            message: "Faild to fetch services",
            error: error.message
        })
    }
}

export const deleteAppointment = async (req,res) => {
    try {
        const { id } = req.query;
        const appointmentId = parseInt(id);

        if ( !appointmentId ) {
            return res.status(400).json({ message: "Missing appointment ID" });
        }

        const existingApp = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!existingApp) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const deletedApp = await prisma.appointment.delete({
            where: {
                id: appointmentId
            }
        });

        res.status(200).json({
            message: "Appointment deleted",
            deletedApp
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to deleat Appointment",
            error: error.message
        })       
    }
}

export const testToken = async (req,res) => {
    try {  
        const user = req.user

        res.status(200).json({
            message: "successfull test",
            user
        })

    } catch (error) {
        res.status(400).json({
            message: "unseccessfull test",
            error: error.message
        })
    }
}