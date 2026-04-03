# WES Field Service Manager - Speaker Notes

## Slide 1 - Executive opening

- Introduce the presentation as a management view of the WES Field Service Manager.
- State that the goal is not just software deployment, but tighter operational control across borehole, solar, and water treatment work.
- Emphasize the three themes: dispatch control, field evidence, and repeat-site intelligence.

## Slide 2 - Why this matters

- Explain the practical field problem: office and site teams need a shared truth.
- Call out how repeat visits are especially expensive when the attending technician does not know the previous diagnosis or prior work done.
- Position the system as an operational control platform, not simply a report form.

## Slide 3 - Access model

- Stress that the design intentionally keeps governance simple with only two roles.
- Admins have identical permissions and can run the office side without role confusion.
- Technicians are restricted to assigned jobs and their own reporting path, which reduces data leakage and keeps the UI clean in the field.

## Slide 4 - End-to-end workflow

- Walk management through the life of a job from creation to approval.
- Pause on step 2 and explain that repeat-site history is retained as part of the job context, which is especially important for unresolved or recurring faults.
- Pause on step 6 and note that approval is not cosmetic; it controls report finalization and PDF release.

## Slide 5 - Admin dashboard

- Point out that management gets a command-center view immediately after login.
- Use the activity stream to show accountability: who created jobs, who started work, who submitted reports, and who approved them.
- Mention that dashboard cards are actionable and route into the relevant operational page.

## Slide 6 - Approval queue

- Explain that this screenshot shows a cleared queue, which is the ideal operational state.
- Mention that when reports are waiting, the queue count is visible and the admin can move through the review list quickly.
- Reinforce the rule that approved reports do not return to the queue.

## Slide 7 - Full report detail and repeat-site history

- This is the strongest proof slide.
- Explain that the admin can review diagnosis, work done, materials, measurements, technician notes, and photos before approving.
- Show that client signature is embedded in the same report record.
- Highlight the repeat-site history block at the bottom and explain that this is what helps the office instruct the next technician properly on revisit jobs.

## Slide 8 - Mobile execution

- Make clear that the system is already positioned for Android installation, not just desktop browser use.
- Explain the value of camera capture, GPS, timestamping, and working through a technician phone.
- If management asks about deployment, note that the APK path has already been demonstrated and the next production step is stable hosting.

## Slide 9 - Architecture and security

- Be direct that the current demonstration build is local and controlled, while the production path is straightforward.
- Explain that React handles the interface, the Express API handles process logic, and the database and storage layer can be hardened for production.
- Mention JWT access control, role separation, and protected review flow as the security baseline.

## Slide 10 - Management ask

- Ask management to approve a pilot, nominate operational owners, and confirm the production hosting path.
- Recommend measuring pilot success using turnaround time, approval time, report completeness, and repeat-visit preparedness.
- Close by framing the system as a quality-control tool for WES, not only an IT project.
