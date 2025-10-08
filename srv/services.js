const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
    this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));

    return super.init();
  }

  changeUrgencyDueToSubject(data) {
    let urgent = data.title?.match(/urgent/i)
    if (urgent) data.urgency_code = 'H'
  }

  /** Custom Validation */
  async onUpdate (req) {
    let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
    if (closed) req.reject `Can't modify a closed incident!`
  }
}
module.exports = { ProcessorService }