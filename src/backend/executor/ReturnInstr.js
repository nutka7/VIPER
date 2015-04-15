define(function() {

    function ReturnInstr() {
        
    }

    ReturnInstr.prototype.invoke = function invoke(context, process) {
        var isVoid = context.returnType.type === "void";
        var returnValue = 0;
        if (!isVoid)
            returnValue = context.pop();
        process.callStack.pop();
        if (process.callStack.length > 0) {
            if (!isVoid)
                process.callStack[process.callStack.length - 1].push(returnValue);
        } else {
            process.exitCode = returnValue;
        }
    };

    ReturnInstr.prototype.toString = function toString() {
        return "RETURN";
    };

    return ReturnInstr;
    
});