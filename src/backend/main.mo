import List "mo:core/List";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Family membership allowlist (restricted to #admin role)
  type FamilyMember = Principal;
  let familySet = Set.empty<FamilyMember>();

  public shared ({ caller }) func addMember(member : FamilyMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add members");
    };
    familySet.add(member);
  };

  public shared ({ caller }) func removeMember(member : FamilyMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can remove members");
    };
    familySet.remove(member);
  };

  public query ({ caller }) func isMember() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check membership");
    };
    familySet.contains(caller);
  };

  public query ({ caller }) func listMembers() : async [FamilyMember] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list members");
    };
    familySet.values().toArray();
  };

  // Group chat functionality (restricted to family members only)
  type MessageId = Nat32;

  type ChatMessage = {
    id : MessageId;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  let chatMessages = Map.empty<MessageId, ChatMessage>();
  var nextMessageId : MessageId = 0;
  let messageList = List.empty<MessageId>();

  public shared ({ caller }) func postMessage(content : Text) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post messages");
    };

    if (not familySet.contains(caller)) {
      Runtime.trap("Unauthorized: Only family members can post messages");
    };

    let messageId = nextMessageId;
    nextMessageId += 1;

    let message : ChatMessage = {
      id = messageId;
      sender = caller;
      content;
      timestamp = Time.now();
    };

    chatMessages.add(messageId, message);
    messageList.add(messageId);

    messageId;
  };

  public query ({ caller }) func fetchMessages(offset : Nat, limit : Nat) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    if (not familySet.contains(caller)) {
      Runtime.trap("Unauthorized: Only family members can view messages");
    };

    let messageIds = messageList.values().toArray();
    if (offset >= messageIds.size()) {
      return [];
    };

    let end = if (offset + limit > messageIds.size()) {
      messageIds.size();
    } else {
      offset + limit;
    };

    let rangeMessageIds = messageIds.sliceToArray(offset, end);

    rangeMessageIds.map(
      func(id) {
        switch (chatMessages.get(id)) {
          case (?message) { message };
          case (null) { Runtime.trap("Message not found") };
        };
      }
    );
  };
};
