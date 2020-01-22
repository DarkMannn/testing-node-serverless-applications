/* eslint-disable require-await */

'use strict';

const Code = require('@hapi/code');
const Lab = require('lab');
const Sinon = require('sinon');
const { emailService } = require('../main.js');
const EventParser = require('../adapters/event-parser.js');
const FileSystem = require('../adapters/file-system.js');
const TemplateRenderer = require('../adapters/template-renderer.js');

exports.lab = Lab.script();

const {
    describe,
    it,
    beforeEach,
    afterEach
} = exports.lab;
const { expect } = Code;

const sandbox = Sinon.createSandbox();
let EmailerStub;
let LoggerStub;
let renderSpy;
const stubbedSqsMessage = { Records: [{ body: {} }] };

describe('Email-notifier-lambda integration test ', () => {

    describe('Digests', () => {

        beforeEach(async () => {

            renderSpy = sandbox.spy(TemplateRenderer, 'render');
            EmailerStub = {
                send: sandbox.stub().resolves()
            };
            LoggerStub = {
                log: sandbox.stub().returns('log'),
                error: sandbox.stub().returns('error')
            };
        });

        afterEach(async () => sandbox.restore());

        it('sends due digest successfully', async () => {

            const eventObject = {
                to: 'darko@gmail.com',
                emailType: 'due',
                data: {
                    userName: 'User',
                    teamName: 'Team1',
                    teamLink: 'someLink',
                    unsubscribeLink: 'someLink',
                    timeSpan: 2,
                    frequencyType: 'daily',
                    itemsCount: 4,
                    locationLinkSpecific: 'first placeholder',
                    locationLinkAll: 'report link'
                }
            };
            stubbedSqsMessage.Records[0].body = eventObject;

            await emailService(EventParser.parse(stubbedSqsMessage), FileSystem, TemplateRenderer, EmailerStub, LoggerStub);

            expect(renderSpy.calledOnce).to.be.true();
            expect(EmailerStub.send.calledOnce).to.be.true();
            expect(EmailerStub.send.firstCall.calledWithMatch({
                to: 'darko@gmail.com',
                from: 'Florence@researchbinders.com',
                'h:Reply-To': 'support@florencehc.com',
                subject: 'Documents Due: Your Daily Update for Team1'
            })).to.be.true();
        });

        it('sends expiring digest successfully', async () => {

            const eventObject = {
                to: 'darko@gmail.com',
                emailType: 'expiring',
                data: {
                    userName: 'User',
                    teamName: 'Team1',
                    teamLink: 'someLink',
                    unsubscribeLink: 'someLink',
                    timeSpan: 2,
                    frequencyType: 'weekly',
                    itemsCount: 4,
                    locationLinkSpecific: 'first placeholder',
                    locationLinkAll: 'report link'
                }
            };
            stubbedSqsMessage.Records[0].body = eventObject;

            await emailService(EventParser.parse(stubbedSqsMessage), FileSystem, TemplateRenderer, EmailerStub, LoggerStub);

            expect(renderSpy.calledOnce).to.be.true();
            expect(EmailerStub.send.calledOnce).to.be.true();
            expect(EmailerStub.send.firstCall.calledWithMatch({
                to: 'darko@gmail.com',
                from: 'Florence@researchbinders.com',
                'h:Reply-To': 'support@florencehc.com',
                subject: 'Documents Expiring: Your Weekly Update for Team1'
            })).to.be.true();
        });

        it('sends taskQueue digest successfully', async () => {

            const eventObject = {
                to: 'darko@gmail.com',
                emailType: 'taskQueue',
                data: {
                    userName: 'User',
                    teamName: 'Team1',
                    teamLink: 'someLink',
                    unsubscribeLink: 'someLink',
                    timeSpan: 2,
                    frequencyType: 'monthly',
                    itemsCount: 4,
                    locationLinkAll: 'first placeholder'
                }
            };
            stubbedSqsMessage.Records[0].body = eventObject;

            await emailService(EventParser.parse(stubbedSqsMessage), FileSystem, TemplateRenderer, EmailerStub, LoggerStub);

            expect(renderSpy.calledOnce).to.be.true();
            expect(EmailerStub.send.calledOnce).to.be.true();
            expect(EmailerStub.send.firstCall.calledWithMatch({
                to: 'darko@gmail.com',
                from: 'Florence@researchbinders.com',
                'h:Reply-To': 'support@florencehc.com',
                subject: 'Tasks Queue: Your Monthly Update for Team1'
            })).to.be.true();
        });

        it('sends signatureQueue digest successfully', async () => {

            const eventObject = {
                to: 'darko@gmail.com',
                emailType: 'signatureQueue',
                data: {
                    userName: 'User',
                    teamName: 'Team1',
                    teamLink: 'someLink',
                    unsubscribeLink: 'someLink',
                    timeSpan: 2,
                    frequencyType: 'monthly',
                    itemsCount: 4,
                    locationLinkSpecific: 'first placeholder',
                    locationLinkAll: 'all'
                }
            };
            stubbedSqsMessage.Records[0].body = eventObject;

            await emailService(EventParser.parse(stubbedSqsMessage), FileSystem, TemplateRenderer, EmailerStub, LoggerStub);

            expect(renderSpy.calledOnce).to.be.true();
            expect(EmailerStub.send.calledOnce).to.be.true();
            expect(EmailerStub.send.firstCall.calledWithMatch({
                to: 'darko@gmail.com',
                from: 'Florence@researchbinders.com',
                'h:Reply-To': 'support@florencehc.com',
                subject: 'Signatures Queue: Your Monthly Update for Team1'
            })).to.be.true();
        });

        it('throws when all needed data is not containted in the event object', async () => {

            const eventObject = {
                to: 'darko@gmail.com',
                emailType: 'due',
                data: {
                    one: 'only one property'
                }
            };
            stubbedSqsMessage.Records[0].body = eventObject;
            let error;

            try {
                await emailService(EventParser.parse(stubbedSqsMessage), FileSystem, TemplateRenderer, EmailerStub, LoggerStub);
            }
            catch (err) {
                error = err;
            }

            expect(error).to.exist();
            expect(LoggerStub.error.calledOnce).to.be.true();
        });
    });
});
