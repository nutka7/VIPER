define([
    '../Cfg',
    '../CfgHelper'
], function (Cfg, CfgHelper) {
    var cfgGenerator;
    
    function For (paramNode) {
	var body = cfgGenerator(paramNode.body);
	var initiation = cfgGenerator(paramNode.pre_statement);
	var condition = cfgGenerator(paramNode.condition);
	var action = cfgGenerator(paramNode.post_statement);

	CfgHelper.toValOrPtr(condition);

	var noopInstr = new Cfg ({
	    type: 'NOOP'
	});
	var stepInstr = new Cfg ({
	    type: 'STEP',
	    param: paramNode.condition.loc
	});
	var branchInstr = new Cfg ({
	    type: 'BRANCH',
	    'true': body.graph.first,
	    'false': noopInstr.graph.first
	});

	condition.mergeRight(stepInstr);

	var result = initiation;
	result.mergeLeft(condition);
	result.mergeLeft(branchInstr);
	body.mergeLeft(action);
	result.mergeTwoLeft(body, noopInstr);

	result.graph[body.last].next = condition.first;

	for (var node in result.graph) {
	    if (result.graph[node].type == 'BREAK') {
		result.graph[node].type = 'NOOP';
		result.graph[node].next = result.last;
	    } else if (result.graph[node].type == 'CONTINUE') {
		result.graph[node].type = 'NOOP';
		result.graph[node].next = action.first;
	    }
	}

	result.type = null;

	return result;
    }

    return (function(_cfgGenerator) {
	cfgGenerator = _cfgGenerator;
	return For;
    });
});
