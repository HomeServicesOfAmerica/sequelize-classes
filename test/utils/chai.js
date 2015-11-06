import chai from 'chai';
import things from 'chai-things';
import asPromised from 'chai-as-promised';
import subset from 'chai-subset';

chai.use(things);
chai.use(asPromised);
chai.use(subset);

export const expect = chai.expect;
export const should = chai.should;
export const assert = chai.assert;