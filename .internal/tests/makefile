NODE_CMD := node --test --test-concurrency 1 --experimental-test-snapshots
TEST_FILE := ./no-otel.test.mjs

run:
	$(NODE_CMD) $(TEST_FILE)
update:
	$(NODE_CMD) --test-update-snapshots $(TEST_FILE)
