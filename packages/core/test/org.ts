import { Org } from "../src/org";
import { Account } from "../src/account";
import { assert } from "chai";
import { suite, test } from "mocha";

suite("Org", () => {
    const password = "correct horse battery staple";
    const account = new Account();
    let org = new Org();
    org.name = "My Organization";

    test("Create Org", async () => {
        await account.initialize(password);
        await org.initialize(account);

        assert.instanceOf(org.privateKey, Uint8Array);
        assert.instanceOf(org.publicKey, Uint8Array);
        assert.isTrue(org.isAdmin(account));
        assert.ok(org.getMember(account.id));
        assert.isTrue(await org.verify(org.getMember(account.id)!));
        assert.isTrue(await org.verify(org.adminGroup));
        assert.isTrue(await org.verify(org.everyoneGroup));
    });

    test("Load/Access Org", async () => {
        org = new Org().fromRaw(org.toRaw());

        assert.ok(!org.privateKey, "Private key should in accessible before explicitly accessed by an admin");

        // Members and groups should be verifiable even without admin access
        assert.instanceOf(org.publicKey, Uint8Array);
        assert.isTrue(org.isAdmin(account));
        assert.ok(org.getMember(account.id));
        assert.isTrue(await org.verify(org.getMember(account.id)!));
        assert.isTrue(await org.verify(org.adminGroup));
        assert.isTrue(await org.verify(org.everyoneGroup));

        await org.access(account);

        assert.instanceOf(
            org.privateKey,
            Uint8Array,
            "Private key should be available after accessing via admin account"
        );
    });
});
