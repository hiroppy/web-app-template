NODE_CMD := node --test --test-concurrency 1 --experimental-test-snapshots

run-common:
	$(NODE_CMD) common.test.mjs
update-common:
	$(NODE_CMD) --test-update-snapshots common.test.mjs

run-all-opt-out:
	$(NODE_CMD) all-opt-out.test.mjs
update-all-opt-out:
	$(NODE_CMD) --test-update-snapshots all-opt-out

run-no-docker:
	$(NODE_CMD) no-docker.test.mjs
update-no-docker:
	$(NODE_CMD) --test-update-snapshots no-docker.test.mjs

run-no-e2e:
	$(NODE_CMD) no-e2e.test.mjs
update-no-e2e:
	$(NODE_CMD) --test-update-snapshots no-e2e.test.mjs

run-no-otel:
	$(NODE_CMD) no-otel.test.mjs
update-no-otel:
	$(NODE_CMD) --test-update-snapshots no-otel.test.mjs

run-no-stripe:
	$(NODE_CMD) no-stripe.test.mjs
update-no-stripe:
	$(NODE_CMD) --test-update-snapshots no-stripe.test.mjs

run-no-sample-code:
	$(NODE_CMD) no-sample-code.test.mjs
update-no-sample-code:
	$(NODE_CMD) --test-update-snapshots no-sample-code.test.mjs

run:
	$(NODE_CMD) *.test.mjs
update:
	$(NODE_CMD) --test-update-snapshots *.test.mjs

skip-tests-update:
	SKIP_TESTS=true $(NODE_CMD) --test-update-snapshots *.test.mjs
