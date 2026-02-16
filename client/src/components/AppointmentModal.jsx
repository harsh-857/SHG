import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AppointmentModal = ({ provider, onClose }) => {
    const [date, setDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState('');

    // Generate time slots (e.g., 9 AM to 5 PM)
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
        if (date) {
            fetchAvailability();
        }
    }, [date]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/appointments/availability/${provider._id}/${date}`);
            setBookedSlots(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!date || !selectedSlot) return;

        setBooking(true);
        setMessage('');

        try {
            await api.post('/appointments/book', {
                providerId: provider._id,
                date,
                timeSlot: selectedSlot
            });
            setMessage('Appointment booked successfully!');
            setTimeout(onClose, 2000); // Close after 2 seconds
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                <h2>Book Appointment with {provider.name}</h2>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Select Date:</label>
                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {date && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Select Time Slot:</label>
                        {loading ? <p>Checking availability...</p> : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {timeSlots.map(slot => {
                                    const isBooked = bookedSlots.includes(slot);
                                    return (
                                        <button
                                            key={slot}
                                            disabled={isBooked}
                                            onClick={() => setSelectedSlot(slot)}
                                            style={{
                                                padding: '8px',
                                                backgroundColor: isBooked ? '#ccc' : (selectedSlot === slot ? '#007bff' : 'white'),
                                                color: isBooked ? '#666' : (selectedSlot === slot ? 'white' : 'black'),
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                opacity: isBooked ? 0.6 : 1
                                            }}
                                        >
                                            {slot}
                                            {isBooked && <span style={{ display: 'block', fontSize: '0.6rem' }}>Booked</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {message && <div style={{ marginBottom: '15px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}

                <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Cancel</button>
                    <button
                        onClick={handleBook}
                        disabled={!date || !selectedSlot || booking}
                        style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', opacity: (!date || !selectedSlot) ? 0.5 : 1 }}
                    >
                        {booking ? 'Booking...' : 'Book Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
