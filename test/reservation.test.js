const expect = require("expect");
const app = require("../app").app;
const request = require("supertest");
const {ObjectID} = require("mongodb");
const {User} = require("../model/user");
const {Reservation} = require("../model/reservation");
const {users, populateUsers} = require("./seed/userSeed");
const {reservations, populateReservation} = require("./seed/reservationSeed");

beforeEach(populateUsers);
beforeEach(populateReservation);


describe("Reservation", () => {

    describe("GET /reservations", () => {

        it("should get every reservations", (done) => {
            request(app)
                .get("/reservations")
                .expect(200)
                .expect((res) => {
                    expect(res.body[0]._id).toBe(reservations[0]._id.toHexString());
                })
                .end(done);
        });
    });

    describe("POST /reservations", () => {

        it("should create new reservation with valid data", (done) => {
            let data = {
                _user: users[0]._id,
                _designer: users[2]._id,
                time: {
                    since: new Date().getTime(),
                    until: new Date().getTime()
                }
            }
            request(app)
                .post("/reservations")
                .send(data)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBeTruthy();
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Reservation.findById(res.body._id).then((foundReservation) => {
                        expect(foundReservation).toBeTruthy();
                        return User.findById(foundReservation._designer);
                    }).then((foundUser) => {
                        expect(foundUser).toBeTruthy();
                        expect(foundUser._reservations[0].toHexString()).toBe(res.body._id);
                        done();
                    }).catch(e => {
                        done(e);
                    })
                });
        });

        it("should not create new reservation with invalid data", (done) => {
            let invalidData = {
                _user: new ObjectID(),
                _designer: users[2]._id,
                time: {
                    since: new Date().getTime(),
                    until: new Date().getTime()
                }
            }
            request(app)
                .post("/reservations")
                .send(invalidData)
                .expect(400)
                .end((err, res) => {
                    if(err) {
                        done(err);
                    }

                    Reservation.find({}).then((foundReservations) => {
                        expect(foundReservations.length).toBe(1);
                        done();
                    }).catch(e => {
                        done(e);
                    });
                });
        });
    });

    describe("DELETE /reservations/:id", () => {

        it("should remove reservation with exist id", (done) => {
            request(app)
                .delete(`/reservations/${reservations[0]._id}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Reservation.find({}).then((foundReservations) => {
                        expect(foundReservations.length).toBe(0);
                        done();
                    }).catch(e => {
                        done(e);
                    });
                });
        });

        it("should not remove reservation with absent id", (done) => {
            request(app)
            .delete(`/reservations/${new ObjectID()}`)
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Reservation.find({}).then((foundReservations) => {
                    expect(foundReservations.length).toBe(1);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
        });
    });

    describe("GET /reservations/:user_id", () => {

        it("should get reservations with exist designer id", (done) => {
            request(app)
                .get(`/reservations/${users[1]._id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body[0]._user).toBe(users[0]._id.toHexString());
                })
                .end(done);
        });

        it("should get reservations with exist user id", (done) => {
            request(app)
                .get(`/reservations/${users[0]._id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body[0]._designer._id).toBe(users[1]._id.toHexString());
                })
                .end(done);
        });

        it("should get 400 with invalid user id", (done) => {
            request(app)
                .get(`/reservations/142`)
                .expect(400)
                .end(done);
        });
    })
})