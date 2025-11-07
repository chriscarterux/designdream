# Basecamp Template Testing Guide

Complete guide for testing your Basecamp project template before onboarding real clients.

## Pre-Testing Checklist

Before you begin testing, ensure:

- [ ] Basecamp account is set up
- [ ] Master template project is created
- [ ] All 5 to-do lists are configured
- [ ] Request Template document is pinned
- [ ] Welcome document is pinned
- [ ] Welcome message is posted

## Test Project Creation

### Step 1: Duplicate the Template

1. Go to your "Design Dreams - Client Template" project
2. Click Settings (gear icon) → Duplicate this project
3. Name it: "Test Client - Design Dreams"
4. Check "Include to-do lists" ✅
5. Check "Include pinned documents" ✅
6. Check "Include message board posts" ✅
7. Click "Duplicate Project"

### Step 2: Verify Structure

Check that the new project has:

- [ ] Project name is correct
- [ ] All 5 to-do lists are present
- [ ] To-do list descriptions are correct
- [ ] Request Template document is pinned
- [ ] Welcome document is pinned
- [ ] Welcome message is visible

## Workflow Testing

### Test 1: Adding a Request

**As the client would**:

1. Go to "📥 Request Backlog" list
2. Click "Add a to-do"
3. Title: "Design homepage hero section"
4. Description: (Copy from Request Template)
   ```
   **What You Need**: Modern hero section with CTA button
   **Context**: Homepage for SaaS product
   **Design Preferences**: Clean, minimal, tech-forward
   **Priority**: 🟡 Medium
   ```
5. Click "Add this to-do"

**Verify**:
- [ ] To-do appears in Backlog
- [ ] Description is formatted correctly
- [ ] You (admin) can see it

### Test 2: Moving Through Workflow

**Simulate the full lifecycle**:

1. **Backlog → Up Next**
   - Move "Design homepage hero section" to "⏭️ Up Next"
   - Add note: "Starting this tomorrow!"

2. **Up Next → In Progress**
   - Move task to "🔨 In Progress"
   - Add comment: "Started working on this. Will have first draft by EOD."

3. **Add Progress Update**
   - Comment on task: "First draft ready! See attached mockup."
   - Upload a test file (any image)

4. **In Progress → Review**
   - Mark task as complete in "In Progress"
   - Move to "👀 Review"
   - Add comment: "Ready for your review! Let me know if you'd like any changes."

5. **Review → Done**
   - Add comment (as client): "Looks great! Approved."
   - Move to "✅ Done"

**Verify**:
- [ ] Task moved smoothly through all stages
- [ ] Comments are visible and formatted correctly
- [ ] File upload worked
- [ ] Can mark task as complete
- [ ] Task is now in Done list

### Test 3: Client Adding Multiple Requests

Add 5 more requests to Backlog to simulate a real client:

1. Fix mobile menu bug
2. Create email template
3. Design logo variations
4. Build contact form
5. Optimize page speed

**Verify**:
- [ ] All requests visible in Backlog
- [ ] Easy to reorder them (drag and drop)
- [ ] Can add notes/comments to each

### Test 4: Communication

Test different communication scenarios:

1. **Comment on a to-do**:
   - Add comment: "Quick question about this request..."
   - Verify you receive notification

2. **Post a message**:
   - Go to Message Board
   - Post: "Weekly update: Completed 3 tasks this week!"
   - Verify it's visible

3. **Upload a file**:
   - Go to Files & Documents
   - Upload test file
   - Verify it's accessible

**Verify**:
- [ ] Comments trigger notifications
- [ ] Messages appear on Message Board
- [ ] Files are stored correctly

## Permission Testing

### Test 5: Invite a Test User

**Create test email** (use Gmail + trick):
- If your email is `yourname@gmail.com`
- Use: `yourname+testclient@gmail.com`
- Gmail treats these as same inbox but Basecamp sees them as different users

**Invite process**:
1. In test project, click "Invite people"
2. Enter test email
3. Set permission level: **Client** (not Admin!)
4. Send invitation

**Log in as test user**:
1. Check email for Basecamp invitation
2. Accept invite
3. Log in as test client

**Verify client can**:
- [ ] See the project
- [ ] View to-do lists
- [ ] Add to-dos to Backlog
- [ ] Comment on to-dos
- [ ] Upload files
- [ ] See pinned documents
- [ ] Post on Message Board

**Verify client CANNOT**:
- [ ] See other projects (should only see their project)
- [ ] Edit to-do list structure
- [ ] Delete to-dos (only admin can)
- [ ] See admin settings

## Webhook Testing (If HOW-203 is complete)

### Test 6: Basecamp Webhook Integration

If you've deployed the Basecamp webhook (HOW-203):

1. **Create a new to-do in test project**:
   - Title: "Create landing page with 5 sections"
   - Description: "Need a full landing page with hero, features, pricing, testimonials, and CTA"

2. **Wait 3-5 seconds**

3. **Check for AI comment**:
   - Should see automated comment from Design Dreams bot
   - Comment should include:
     - Classification (SIMPLE or COMPLEX)
     - Estimated hours
     - Reasoning
     - Suggested action
     - Subtasks (if COMPLEX)

**Verify**:
- [ ] Webhook fired successfully
- [ ] Comment appeared in Basecamp
- [ ] Analysis makes sense
- [ ] No errors in logs

**If webhook fails**:
- Check Vercel function logs
- Verify environment variables are set
- Test webhook registration (see HOW-203)

## Performance Testing

### Test 7: Speed and Usability

Test the user experience:

1. **Load time**: Does project load quickly?
2. **Navigation**: Easy to find to-do lists?
3. **Search**: Can you search for to-dos?
4. **Mobile**: Test on phone browser
5. **Notifications**: Do you get email/push notifications?

**Verify**:
- [ ] Project loads in <2 seconds
- [ ] Navigation is intuitive
- [ ] Search works
- [ ] Mobile view is usable
- [ ] Notifications are timely

## Edge Cases

### Test 8: Error Scenarios

Test what happens when things go wrong:

1. **Empty Backlog**:
   - What does client see when no requests?
   - Is it clear how to add one?

2. **Overloaded Backlog**:
   - Add 20 requests
   - Still manageable?
   - Can prioritize easily?

3. **Large Files**:
   - Upload 50MB file
   - Does it work?
   - What's the limit?

4. **Deleted To-Do**:
   - Delete a to-do
   - Can you restore it?
   - Does client get notified?

**Verify**:
- [ ] Handles edge cases gracefully
- [ ] No broken UI
- [ ] Clear error messages

## Final Checks

### Test 9: End-to-End Client Journey

Simulate a complete client experience from start to finish:

1. **Day 1**: Client receives Basecamp invite
2. **Day 1**: Client logs in, reads welcome docs
3. **Day 1**: Client adds first 3 requests to Backlog
4. **Day 2**: You move first request to In Progress
5. **Day 3**: You deliver first task to Review
6. **Day 4**: Client approves, moves to Done
7. **Day 5**: Repeat with second request

**Verify the entire flow feels smooth and clear**

## Documentation Review

### Test 10: Are Docs Clear?

Have someone else (friend, colleague) try to:

1. Read the Welcome document
2. Use the Request Template
3. Add a request to Backlog
4. Ask: "Is anything confusing?"

**Iterate based on feedback**

## Post-Testing Actions

After successful testing:

### Cleanup Test Project

- [ ] Delete test project (or keep for future reference)
- [ ] Remove test user
- [ ] Clear test data

### Update Master Template

Based on testing, update template with:
- [ ] Better wording in descriptions
- [ ] Additional FAQs
- [ ] Clearer instructions
- [ ] Any missing details

### Document Issues Found

Create Linear issues for any problems:
- Confusing wording → HOW-XXX: Improve Basecamp template wording
- Missing feature → HOW-XXX: Add XYZ to template
- Performance issue → HOW-XXX: Optimize Basecamp project loading

### Mark HOW-202 as Complete

Once testing is done and template is refined:
- [ ] All tests passed
- [ ] Template updated
- [ ] Documentation is clear
- [ ] Ready to onboard first real client
- [ ] Update Linear issue to "Done"

## Common Issues & Solutions

### Issue: Can't invite test user
**Solution**: Check email address format, verify Basecamp permissions

### Issue: Webhook not firing
**Solution**: See BASECAMP-WEBHOOK-SETUP.md, check webhook registration

### Issue: To-dos not reordering
**Solution**: Use drag-and-drop, or click "Reorder" button

### Issue: Files not uploading
**Solution**: Check file size (<100MB), check file type, try different browser

### Issue: Notifications not working
**Solution**: Check Basecamp notification settings, check email spam folder

## Success Criteria

Template is ready when:

✅ All 10 tests completed successfully
✅ No critical bugs found
✅ Test user can complete full workflow
✅ Webhook integration works (if implemented)
✅ Documentation is clear
✅ Template can be duplicated quickly (<5 minutes)
✅ Team member (if applicable) can use it
✅ Ready to onboard first real client

## Next Steps

- ✅ Test template one more time with fresh eyes
- ✅ Make final tweaks
- ✅ Delete test project
- ✅ Lock master template (mark as "DO NOT DELETE")
- ✅ Ready to launch! (HOW-225: Final Pre-Launch QA)

---

**Testing Checklist Summary:**

- [ ] Test 1: Adding a request
- [ ] Test 2: Moving through workflow
- [ ] Test 3: Multiple requests
- [ ] Test 4: Communication
- [ ] Test 5: Client permissions
- [ ] Test 6: Webhook integration (optional)
- [ ] Test 7: Performance
- [ ] Test 8: Edge cases
- [ ] Test 9: End-to-end journey
- [ ] Test 10: Documentation clarity

**Estimated Testing Time**: 1-2 hours

---

Questions or issues during testing? hello@designdream.is
