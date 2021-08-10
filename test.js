const chai = require('chai');
var supertest = require("supertest");
var should = chai.should();

var server = supertest.agent("http://localhost:3000");

describe('BMI Calculator', () => {
   it("should return home page",function(done){
      server
      .get("/bmicalc")
      .expect(200)
      .end(function(err,res){
         res.status.should.equal(200);
         chai.assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
         
         done();
      });
   });

   it("should return 404",function(done){
      server
      .get("/random")
      .expect(404)
      .end(function(err,res){
         res.status.should.equal(404);
         done();
      });
   });
});