const expect = require("expect");
const app = require("../app").app;
const request = require("supertest");
const {ObjectID} = require("mongodb");
const {Recruit} = require("../model/recruit");
const {recruits, populateRecruits} = require("./seed/recruitSeed");
const {users, populateUsers} = require("./seed/userSeed");

// seed Recruit db
beforeEach(populateUsers);
beforeEach(populateRecruits);


// test Recruit
describe("Recruit", () => {

    describe("GET /recruits", () => {

        it("should get every recruits", (done) => {
            request(app)
                .get("/recruits")
                .expect(200)
                .expect((res) => {
                    expect(res.body[0]._designer._id).toBe(users[1]._id.toHexString());
                })
                .end(done);
        })
    })

    describe("GET /recruits/:id", () => {

        it("should get one recruit with valid exist user id", (done) => {
            request(app)
                .get(`/recruits/${recruits[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body._designer._id).toBe(users[1]._id.toHexString());
                })
                .end(done);
        });

        it("should get 400 with invalid user id", (done) => {
            request(app)
                .get(`/recruits/123`)
                .expect(400)
                .end(done);
        });

        it("should get 400 with absent user id", (done) => {
            request(app)
                .get(`/recruits/${new ObjectID().toHexString()}`)
                .expect(400)
                .end(done);
        })
    });

    describe("POST /recruits", () => {

        it("should make recruit with valid params", (done) => {
            let data = {
                _designer: users[2]._id,
                title: "두번째 디자이너의 모집글"
            }
            request(app)
                .post('/recruits')
                .send(data)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Recruit.find().then((foundRecruits) => {
                        expect(foundRecruits.length).toBe(2);
                        done();
                    }).catch(e => {
                        done(e);
                    })
                });
        });

        it("should not make recruit with invalid params", (done) => {
            let invalidData = {
                title: "디자이너 아이디가 없음"
            }
            request(app)
                .post("/recruits")
                .send(invalidData)
                .expect(400)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Recruit.find().then((foundRecruits) => {
                        expect(foundRecruits.length).toBe(1);
                        done();
                    }).catch(e => {
                        done(e);
                    });
                });
        });
    });

    describe("DELETE /recruits/:id", () => {
        
        it("should remove recruit with valid user id", (done) => {
            request(app)
                .delete(`/recruits/${recruits[0]._id.toHexString()}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Recruit.find().then((foundRecruits) => {
                        expect(foundRecruits.length).toBe(0);
                        done();
                    }).catch(e => {
                        done(e);
                    });
                });
        });

        it("should not remove recruit with absent user id", (done) => {
            request(app)
                .delete(`/recruits/${new ObjectID().toHexString()}`)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Recruit.find().then((foundRecruits) => {
                        expect(foundRecruits.length).toBe(1);
                        done();
                    }).catch(e => {
                        done(e);
                    });
                });
        });

        it("should get 400 with invalid user id", (done) => {
            request(app)
                .delete("/recruits/123")
                .expect(400)
                .end(done);
        });
    });

    describe("PATCH /recruits/:id", () => {

        it("should update recruit with exist id", (done) => {
            let title = "수정된 타이틀";
            let ableDates = [
                {
                    since: new Date().getTime(),
                    until: new Date().getTime() + 6000000
                },
                {
                    since: new Date().getTime(),
                    until: new Date().getTime() + 6000000
                }
            ]
            request(app)
                .patch(`/recruits/${recruits[0]._id}`)
                .send({title, ableDates})
                .expect(200)
                .expect((res) => {
                    expect(res.body.title).toBe(title);
                })
                .end((err, res) => {
                    if(err) {
                        done(err);
                    } else {
                        Recruit.findById(recruits[0]._id).then((foundRecruit) => {
                            expect(foundRecruit.title).toBe(title);
                            expect(foundRecruit.ableDates[1].since).toBe(ableDates[1].since);
                            done();
                        }).catch(e => {
                            done(e);
                        });
                    }
                });
        });

        it("should return 400 with absent id", (done) => {
            let title = "수정된 타이틀";
            request(app)
                .patch(`/recruits/${new ObjectID().toHexString()}`)
                .send({title})
                .expect(400)
                .end(done);
        })

        it("should return 400 with invalid id", (done) => {
            let title = "수정된 타이틀";
            request(app)
                .patch(`/recruits/12`)
                .send({title})
                .expect(400)
                .end(done);
        })
    });
});